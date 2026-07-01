namespace workgrid.Application.Common.Interfaces;

public interface IUser
{
    string? Id { get; }
    string? Username { get; }
    string? Role { get; }
}