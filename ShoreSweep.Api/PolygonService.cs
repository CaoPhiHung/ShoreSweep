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
    public class PolygonService
    {
        public PolygonService() { }

        [Route(HttpVerb.Get, "/polygons")]
        public RestApiResult GetAll()
        {
            return new RestApiResult
            {
                Json = BuildJsonArray(ClarityDB.Instance.Polygons)
            };
        }

        private JArray BuildJsonArray(IEnumerable<Polygon> polygons)
        {
            JArray array = new JArray();

            foreach (Polygon polygon in polygons)
            {
                array.Add(polygon.ToJson());
            }

            return array;
        }

        [Route(HttpVerb.Post, "/importPolygons")]
        public RestApiResult ImportPolygons(JObject json)
        {
            if (json == null)
            {
                return new RestApiResult { StatusCode = HttpStatusCode.BadRequest };
            }
            var polygons = json.Value<JArray>("polygons");

            List<Polygon> polygonList = new List<Polygon>();

            foreach (var polygon in polygons)
            {
                Polygon newPolygon = new Polygon();
                newPolygon.ApplyJson(polygon);
                Polygon oldPolygon = ClarityDB.Instance.Polygons.FirstOrDefault(x => x.Name == newPolygon.Name);
                if (oldPolygon == null)
                {
                    polygonList.Add(newPolygon);
                    ClarityDB.Instance.Polygons.Add(newPolygon);
                }
            }

            ClarityDB.Instance.SaveChanges();
            return new RestApiResult { StatusCode = HttpStatusCode.OK, Json = BuildJsonArray(polygonList) };
        }
    }
}