const express = require("express");
const router = express.Router();

const Data = require("../../models/data");
const Arr = require("../../models/arr");
const Userprofile = require("../../models/user");

//@route GET api/data/getData
//@des   GET All data
//@accee Public
router.get("/getData", (req, res) => {
  Data.find(
    { $or: [{ applicant: req.query.name }, { respondent: req.query.name }] },
    (err, data) => {
      if (err) return res.json({ success: false, error: err });
      return res.json({ success: true, data: data });
    }
  );
});

router.get("/getDataClerk", (req, res) => {
  Data.find(
    {
      sub_files: {
        $exists: true,
        $ne: [],
        $elemMatch: { pending_docs: { $exists: true } }
      }
    },
    (err, data) => {
      if (err) {
        return res.json({ success: false, error: err });
      } else {
        return res.json({ success: true, data: data });
      }
    }
  );
});

router.get("/getTonyData", (req, res) => {
  Data.find({ id: "FS-19-111111" }, (err, data) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, data: data });
  });
});

router.get("/userlogin/:email/:password", (req, res) => {
  Userprofile.findOne(
    {
      $and: [{ email: req.params.email }, { password: req.params.password }]
    },
    (err, data) => {
      if (err) return res.json({ success: false, data: "err" });
      return res.json({ success: true, data: data });
    }
  );
});

router.get("/getDataLawyer", (req, res) => {
  Data.find(
    {
      $or: [
        {
          sub_files: {
            $elemMatch: { applicant_lawyer: req.query.name }
          }
        },
        {
          sub_files: {
            $elemMatch: { respondent_lawyer: req.query.name }
          }
        }
      ]
    },
    (err, data) => {
      if (err) return res.json({ success: false, error: err });
      return res.json({ success: true, data: data });
    }
  );
});

//@route post api/data/updatedata
//@des   overwrite the data
//@accee Public
router.post("/updateData", (req, res) => {
  const fileid = req.body.fileid;
  const updateData = req.body.updateData;
  var key = req.body.subfileQuery;

  Data.findOneAndUpdate(
    { id: fileid },
    {
      $push: {
        [key]: updateData
      }
    },
    { safe: true, upsert: true },
    function(err, doc) {
      if (err) {
        console.log(err);
      } else {
        res.send("success");
      }
    }
  );
});

router.post("/linkCase", (req, res) => {
  const fileid = req.body.fileid;
  Data.findOneAndUpdate(
    { id: fileid },
    {
      linked: "yes"
    },
    { safe: true, upsert: true },
    function(err, doc) {
      if (err) {
        console.log(err);
      } else {
        res.send("success");
      }
    }
  );
});

router.post("/linklawyerCase", (req, res) => {
  const fileid = req.body.fileid;
  Data.findOneAndUpdate(
    { id: fileid },
    {
      "sub_files.0.lawyer_linked": "yes"
    },
    { safe: true, upsert: true },
    function(err, doc) {
      if (err) {
        console.log(err);
      } else {
        res.send("success");
      }
    }
  );
});

router.post("/deleteFromPending", (req, res) => {
  const fileid = req.body.fileid;
  const updateData = req.body.updateData;
  var key = req.body.subfileQuery;
  const data = {
    [key]: updateData
  };
  Data.findOneAndUpdate(
    { id: fileid },
    {
      $pull: {
        [key]: { enc_doc_name: updateData.enc_doc_name }
      }
    },
    { safe: true, upsert: true },
    function(err, doc) {
      if (err) {
        console.log(err);
      } else {
        res.send("success");
      }
    }
  );
});

router.post("/deleteTonyData", (req, res) => {
  const fileid = req.body.fileid;
  Data.findOneAndUpdate(
    { id: fileid },
    {
      $set: {
        other_documents: [],
        rejected_docs: [],
        sub_files: [
          {
            number: "0000",
            applicant_lawyer: "Eric Hall",
            respondent_lawyer: "Melanie Kash",
            continuing_record: [],
            order_endorsements: [],
            pending_docs: [],
            lawyer_linked: "no"
          }
        ],
        linked: "no"
      }
    },
    { safe: true, upsert: true },
    function(err, doc) {
      if (err) {
        console.log("errr", err);
      } else {
        res.send("success");
      }
    }
  );
});

//@route  delete api/data/deleteData
//@des    Delete the data by id
//@access Public
router.delete("/deleteData", (req, res) => {
  const { id } = req.body;
  Data.findByIdAndRemove(id, err => {
    if (err) return res.send(err);
    return res.json({ success: true });
  });
});

//@route  delete api/data/putData
//@des    Creat a new data
//@access Public
router.post("/putData", (req, res) => {
  const { id, records } = req.body;

  if ((!id && id !== 0) || !records) {
    return res.json({
      success: false,
      error: "INVALID INPUTS"
    });
  }

  const data = new Data({
    records: records,
    id: id
  });

  data.save(err => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });
});

module.exports = router;
