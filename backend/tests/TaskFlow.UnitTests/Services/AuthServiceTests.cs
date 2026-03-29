using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Moq;
using TaskFlow.Application.DTOs.Auth;
using TaskFlow.Application.Exceptions;
using TaskFlow.Application.Interfaces;
using TaskFlow.Domain.Entities;
using TaskFlow.Domain.Enums;
using TaskFlow.Infrastructure.Services;

namespace TaskFlow.UnitTests.Services;

public class AuthServiceTests
{
    private readonly Mock<UserManager<User>> _userManagerMock;
    private readonly Mock<ITokenService> _tokenServiceMock;
    private readonly IConfiguration _configuration;
    private readonly AuthService _authService;

    public AuthServiceTests()
    {
        // UserManager mock — constructor'ı karmaşık olduğu için helper kullanılır
        var store = new Mock<IUserStore<User>>();
        _userManagerMock = new Mock<UserManager<User>>(
            store.Object, null!, null!, null!, null!, null!, null!, null!, null!);

        _tokenServiceMock = new Mock<ITokenService>();
        _tokenServiceMock.Setup(x => x.GenerateAccessToken(It.IsAny<User>())).Returns("fake-jwt-token");
        _tokenServiceMock.Setup(x => x.GenerateRefreshToken()).Returns("fake-refresh-token");

        // In-memory configuration
        var configData = new Dictionary<string, string?>
        {
            { "JwtSettings:AccessTokenExpirationMinutes", "30" }
        };
        _configuration = new ConfigurationBuilder()
            .AddInMemoryCollection(configData)
            .Build();

        _authService = new AuthService(_userManagerMock.Object, _tokenServiceMock.Object, _configuration);
    }

    // ==================== REGISTER ====================

    [Fact]
    public async Task RegisterAsync_ValidRequest_ReturnsAuthResponse()
    {
        // Arrange
        var request = new RegisterRequest
        {
            FullName = "Test User",
            Email = "test@test.com",
            Password = "Test1234"
        };

        _userManagerMock.Setup(x => x.FindByEmailAsync(request.Email))
            .ReturnsAsync((User?)null);

        _userManagerMock.Setup(x => x.CreateAsync(It.IsAny<User>(), request.Password))
            .ReturnsAsync(IdentityResult.Success);

        // Act
        var result = await _authService.RegisterAsync(request);

        // Assert
        Assert.Equal("Test User", result.FullName);
        Assert.Equal("test@test.com", result.Email);
        Assert.Equal("Developer", result.Role);
        Assert.Equal("fake-jwt-token", result.Token);
    }

    [Fact]
    public async Task RegisterAsync_WithAdminRole_ReturnsAdminRole()
    {
        // Arrange
        var request = new RegisterRequest
        {
            FullName = "Admin User",
            Email = "admin@test.com",
            Password = "Admin1234",
            Role = UserRole.Admin
        };

        _userManagerMock.Setup(x => x.FindByEmailAsync(request.Email))
            .ReturnsAsync((User?)null);

        _userManagerMock.Setup(x => x.CreateAsync(It.IsAny<User>(), request.Password))
            .ReturnsAsync(IdentityResult.Success);

        // Act
        var result = await _authService.RegisterAsync(request);

        // Assert
        Assert.Equal("Admin", result.Role);
    }

    [Fact]
    public async Task RegisterAsync_DuplicateEmail_ThrowsConflictException()
    {
        // Arrange
        var existingUser = new User { FullName = "Existing", Email = "test@test.com" };

        _userManagerMock.Setup(x => x.FindByEmailAsync("test@test.com"))
            .ReturnsAsync(existingUser);

        var request = new RegisterRequest
        {
            FullName = "New User",
            Email = "test@test.com",
            Password = "Test1234"
        };

        // Act & Assert
        await Assert.ThrowsAsync<ConflictException>(
            () => _authService.RegisterAsync(request));
    }

    [Fact]
    public async Task RegisterAsync_WeakPassword_ThrowsBadRequestException()
    {
        // Arrange
        var request = new RegisterRequest
        {
            FullName = "Test User",
            Email = "test@test.com",
            Password = "weak"
        };

        _userManagerMock.Setup(x => x.FindByEmailAsync(request.Email))
            .ReturnsAsync((User?)null);

        _userManagerMock.Setup(x => x.CreateAsync(It.IsAny<User>(), request.Password))
            .ReturnsAsync(IdentityResult.Failed(new IdentityError { Description = "Password too weak" }));

        // Act & Assert
        await Assert.ThrowsAsync<BadRequestException>(
            () => _authService.RegisterAsync(request));
    }

    // ==================== LOGIN ====================

    [Fact]
    public async Task LoginAsync_ValidCredentials_ReturnsAuthResponse()
    {
        // Arrange
        var user = new User
        {
            Id = Guid.NewGuid(),
            FullName = "Test User",
            Email = "test@test.com",
            IsActive = true
        };

        _userManagerMock.Setup(x => x.FindByEmailAsync("test@test.com"))
            .ReturnsAsync(user);

        _userManagerMock.Setup(x => x.CheckPasswordAsync(user, "Test1234"))
            .ReturnsAsync(true);

        var request = new LoginRequest { Email = "test@test.com", Password = "Test1234" };

        // Act
        var result = await _authService.LoginAsync(request);

        // Assert
        Assert.Equal("Test User", result.FullName);
        Assert.Equal("fake-jwt-token", result.Token);
    }

    [Fact]
    public async Task LoginAsync_WrongEmail_ThrowsUnauthorizedException()
    {
        // Arrange
        _userManagerMock.Setup(x => x.FindByEmailAsync("wrong@test.com"))
            .ReturnsAsync((User?)null);

        var request = new LoginRequest { Email = "wrong@test.com", Password = "Test1234" };

        // Act & Assert
        await Assert.ThrowsAsync<UnauthorizedException>(
            () => _authService.LoginAsync(request));
    }

    [Fact]
    public async Task LoginAsync_WrongPassword_ThrowsUnauthorizedException()
    {
        // Arrange
        var user = new User { FullName = "Test", Email = "test@test.com", IsActive = true };

        _userManagerMock.Setup(x => x.FindByEmailAsync("test@test.com"))
            .ReturnsAsync(user);

        _userManagerMock.Setup(x => x.CheckPasswordAsync(user, "wrong"))
            .ReturnsAsync(false);

        var request = new LoginRequest { Email = "test@test.com", Password = "wrong" };

        // Act & Assert
        await Assert.ThrowsAsync<UnauthorizedException>(
            () => _authService.LoginAsync(request));
    }

    [Fact]
    public async Task LoginAsync_InactiveAccount_ThrowsUnauthorizedException()
    {
        // Arrange
        var user = new User
        {
            FullName = "Inactive User",
            Email = "inactive@test.com",
            IsActive = false  // Pasif hesap
        };

        _userManagerMock.Setup(x => x.FindByEmailAsync("inactive@test.com"))
            .ReturnsAsync(user);

        _userManagerMock.Setup(x => x.CheckPasswordAsync(user, "Test1234"))
            .ReturnsAsync(true);

        var request = new LoginRequest { Email = "inactive@test.com", Password = "Test1234" };

        // Act & Assert
        await Assert.ThrowsAsync<UnauthorizedException>(
            () => _authService.LoginAsync(request));
    }
}
