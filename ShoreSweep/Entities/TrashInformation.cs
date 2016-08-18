using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;
using System.Data;

namespace ShoreSweep
{
    public class TrashInformation : Entity
    {
        public long TrashID { get; set; }
        public string Latitude { get; set; }
        public string Longitude { get; set; }
        public string Continent { get; set; }
        public string Country { get; set; }
        public string AdministrativeArea1 { get; set; }
        public string AdministrativeArea2 { get; set; }
        public string AdministrativeArea3 { get; set; }
        public string Locality { get; set; }
        public string SubLocality { get; set; }
        public string Description { get; set; }
        public Status Status { get; set; }
        public string Url { get; set; }
        public string Images { get; set; }
        public Size Size { get; set; }
        public string Type { get; set; }
        public string AssignedTo { get; set; }

        public void ApplyJson(JToken json)
        {
            TrashID = json.Value<long>("trashId");
            Latitude = json.Value<string>("latitude");
            Longitude = json.Value<string>("longitude");

            Continent = json.Value<string>("continent");
            Country = json.Value<string>("country");

            AdministrativeArea1 = json.Value<string>("administrativeArea1");
            AdministrativeArea2 = json.Value<string>("administrativeArea2");
            AdministrativeArea3 = json.Value<string>("AdministrativeArea3");

            Locality = json.Value<string>("locality");
            SubLocality = json.Value<string>("subLocality");
            Description = json.Value<string>("description");

            //Status = (Status)json.Value<int>("status");
            //Size = (Size)json.Value<int>("size");

            Url = json.Value<string>("url");
            Images = json.Value<string>("images");
            Type = json.Value<string>("type");
            AssignedTo = json.Value<string>("assignedTo");
        }


    }
}
