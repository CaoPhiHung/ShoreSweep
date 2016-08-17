using ShoreSweep.Api.Framework;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using System.IO;
using System.Data;

namespace ShoreSweep.Api
{
    public class TrashService
    {
        
        public TrashService() { }


        [Route(HttpVerb.Post, "/trash/importCSV")]
        public RestApiResult ImportCSV(IHttpFileCollection httpFileCollection)
        {
            if (httpFileCollection.Count == 0 || httpFileCollection[0] == null)
            {
                string error = "{ error : 'File Not Found'}";
                return new RestApiResult { StatusCode = HttpStatusCode.NotFound, Json = JObject.Parse(error) };
            }

            var file = httpFileCollection[0];
            // DataTable dataTable;

            //KioskLog log = new KioskLog();
            //log.ApplyJson(json);
            //ClarityDB.Instance.KioskLogs.Add(log);
            ClarityDB.Instance.SaveChanges();

            return new RestApiResult { StatusCode = HttpStatusCode.OK };
        }
    }
}
