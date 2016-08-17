using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ShoreSweep.Api.Framework;

namespace ShoreSweep.UnitTests
{
    public class FakeFormsAuthentication : IFormAuthenticationService
    {
        private bool setAuthCookieCalled = false;
        private bool signOutCalled = false;

        public bool SignOutCalled
        {
            get { return signOutCalled; }
        }

        public bool SetAuthCookieCalled
        {
            get { return setAuthCookieCalled; }
        }

        public void SetAuthCookie(string username, bool createPersistenceCookies)
        {
            setAuthCookieCalled = true;
        }

        public void SignOut()
        {
            signOutCalled = true;
        }
    }
}
