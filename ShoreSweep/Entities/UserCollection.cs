using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;

namespace ShoreSweep
{
    public class UserCollection: KeyedCollection<string, User>
    {
        protected override string GetKeyForItem(User user)
        {
            return user.UserName;
        }
    }
}
