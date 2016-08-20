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

        [Route(HttpVerb.Get, "/trashes")]
        public RestApiResult GetAll()
        {
            var trashInfos = ClarityDB.Instance.TrashInformations;
            return new RestApiResult { StatusCode = HttpStatusCode.OK, Json = BuildJsonArray(trashInfos) };
        }

        [Route(HttpVerb.Post, "/trash/importTrashRecord")]
        public RestApiResult ImportTrashRecord(JObject json)
        {
            if (json == null)
            {
                return new RestApiResult { StatusCode = HttpStatusCode.BadRequest };
            }
            var trashes = json.Value<JArray>("trashes");

            List<TrashInformation> trashList = new List<TrashInformation>();

            foreach (var trash in trashes)
            {
                TrashInformation newTrash = new TrashInformation();
                newTrash.ApplyJson(trash);
                TrashInformation oldTrash = ClarityDB.Instance.TrashInformations.FirstOrDefault(x => x.TrashID == newTrash.TrashID);
                if (oldTrash == null)
                {
                    trashList.Add(newTrash);
                    ClarityDB.Instance.TrashInformations.Add(newTrash);
                }
            }

            ClarityDB.Instance.SaveChanges();
            return new RestApiResult { StatusCode = HttpStatusCode.OK, Json = BuildJsonArray(trashList) };
        }


        private JArray BuildJsonArray(IEnumerable<TrashInformation> trashInfos)
        {
            JArray array = new JArray();

            foreach (TrashInformation trashInfo in trashInfos)
            {
                array.Add(trashInfo.ToJson());
            }

            return array;
        }

    }
}
