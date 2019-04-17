const searchConstants = {
    emailSearchJSON: (email) => ({
        "baseEntityAttributes": [
                      {
                         "baseEntityCode": "SBE_USER",
                         "attributeCode": "PRI_EMAIL",
                         "attributeName": "=",
                         "created": "2018-04-26T14:05:06.843",
                         "valueString": email,
                         "weight": 1.0,
                         "inferred": false,
                         "privacyFlag": false
                       }
                   ],
                     "links": [],
                     "code": "SBE_USER",
                     "index": 0,
                     "created": "2018-04-26T14:05:06.842",
                     "name": "List of Users",
                     "realm": "genny"
                   })
  };


  export default searchConstants;