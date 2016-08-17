using ShoreSweep.Api.Framework;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace ShoreSweep.Api
{
    public class UserService
    {
        public UserService() { }

        [Route(HttpVerb.Get, "/user")]
        public RestApiResult GetAllUsers()
        {
            var users = ClarityDB.Instance.Users;

            return new RestApiResult { StatusCode = HttpStatusCode.OK, Json = BuildJsonArray(users) };
        }

        private JArray BuildJsonArray(IEnumerable<User> users)
        {
            JArray array = new JArray();

            foreach (User user in users)
            {
                array.Add(user.ToJson());
            }
            return array;
        }
    }
}
