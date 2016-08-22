using System;
using System.Data.Entity;

namespace ShoreSweep
{
    public interface IClarityDB : IDisposable
    {
        IDbSet<User> Users { get; set; }
        IDbSet<Assignee> Assignees { get; set; }
        IDbSet<TrashInformation> TrashInformations { get; set; }
        Database Database { get; }

        void AddEntity<T>(T entity) where T : class;
        int SaveChanges();
    }
}
