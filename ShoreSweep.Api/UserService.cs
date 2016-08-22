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

    [Route(HttpVerb.Post, "/user")]
    public RestApiResult Create(JObject json)
    {
      if (json == null)
        return new RestApiResult { StatusCode = HttpStatusCode.BadRequest };

      User user = User.FromJson(json);

      if (ClarityDB.Instance.Users.Any(x => x.UserName.ToLower() == user.UserName.ToLower()))
      {
        string errorJson = "{ 'error': 'User name exists' }";
        return new RestApiResult { StatusCode = HttpStatusCode.Conflict, Json = JObject.Parse(errorJson) };
      }

      ClarityDB.Instance.Users.Add(user);
      ClarityDB.Instance.SaveChanges();

      return new RestApiResult { StatusCode = HttpStatusCode.OK, Json = user.ToJson() };
    }

    [Route(HttpVerb.Post, "/user/assignee")]
    public RestApiResult CreateAssignee(JObject json)
    {
      if (json == null)
        return new RestApiResult { StatusCode = HttpStatusCode.BadRequest };

      Assignee user = Assignee.FromJson(json);

      if (ClarityDB.Instance.Assignees.Any(x => x.UserName.ToLower() == user.UserName.ToLower()))
      {
        string errorJson = "{ 'error': 'Assignee name exists' }";
        return new RestApiResult { StatusCode = HttpStatusCode.Conflict, Json = JObject.Parse(errorJson) };
      }

      ClarityDB.Instance.Assignees.Add(user);
      ClarityDB.Instance.SaveChanges();

      return new RestApiResult { StatusCode = HttpStatusCode.OK, Json = user.ToJson() };
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
