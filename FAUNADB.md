# FaunaDB

To enabling FaunaDb, you need
 * A account on the website of [FaunaDb](https://dashboard.fauna.com/accounts/login)
 * A [Database with a choosen "Region Group"](https://dashboard.fauna.com/?createDb=true) (save the region endpoint on your computer)
 * A secret key for this Database with Role : "Admin". (save it on your computer)

You can copy/past this code bellow to create the Collections & the Indexes 

```shell
CreateCollection({
  name: "TimelineChart",
  history_days: 30,
  ttl_days: null
})

CreateIndex({
    name: "getTimelineByKeyAndReadKeyDesc",
    unique: false,
    serialized: true,
    source: Collection("TimelineChart"),
    terms: [{field: ["data", "readKey"]},{field: ["data", "key"]}],
    values: [{ field: ["ref"], reverse: true } ]
  })
  
  CreateIndex({
    name: "getTimelineByKeyAndWriteKeyDesc",
    unique: false,
    serialized: true,
    source: Collection("TimelineChart"),
    terms: [{field: ["data", "writeKey"]},{field: ["data", "key"]}],
    values: [{ field: ["ref"], reverse: true }]
  })
  
  CreateIndex({
    name: "getTimelineByKeyAndWriteKeyAsc",
    unique: false,
    serialized: true,
    source: Collection("TimelineChart"),
    terms: [{field: ["data", "writeKey"]},{field: ["data", "key"]}],
    values: [{ field: ["ref"] }]
  })
  
  CreateIndex({
    name: "getTimelineByKeyAndOwnerKeyDesc",
    unique: false,
    serialized: true,
    source: Collection("TimelineChart"),
    terms: [{field: ["data", "ownerKey"]},{field: ["data", "key"]}],
    values: [{ field: ["ref"], reverse: true }]
  })
  CreateIndex({
    name: "getTimelineByKeyAndOwnerKeyAsc",
    unique: false,
    serialized: true,
    source: Collection("TimelineChart"),
    terms: [{field: ["data", "ownerKey"]},{field: ["data", "key"]}]
  })
```