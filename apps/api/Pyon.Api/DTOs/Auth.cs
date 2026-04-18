namespace __PYON_NAMESPACE__.Api.DTOs;

public record RegisterRequest(string Email, string Password, string DisplayName);
public record LoginRequest(string Email, string Password);
public record AuthResponse(string Token, MeResponse User);
public record MeResponse(Guid Id, string Email, string DisplayName, bool IsAdmin);
