using System;
namespace ShoreSweep
{
    public interface IPasswordHash
    {
        byte[] CreateSalt();
        string CreatePasswordHash(string password, byte[] salt);
    }
}
