const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// this will be our data base's data structure
const DataSchema = new Schema({
  id: String,
  linked: String,
  sub_files: [
    {
      number: String,
      lawyer_linked: String,
      applicant_lawyer: String,
      respondent_lawyer: String,

      continuing_record: [
        {
          document: String,
          date_filed: String,
          submitted_by: String,
          enc_doc_name: String
        }
      ],
      order_endorsements: [
        {
          document: String,
          date_filed: String,
          submitted_by: String,
          enc_doc_name: String
        }
      ],
      pending_docs: [
        {
          document: String,
          date_filed: String,
          submitted_by: String,
          enc_doc_name: String,
          review_date: String
        }
      ]
    }
  ],
  other_documents: [
    {
      document: String,
      date_filed: String,
      submitted_by: String,
      enc_doc_name: String
    }
  ],
  rejected_docs: [
    {
      document: String,
      submitted_by: String,
      enc_doc_name: String
    }
  ]
});

// export the new Schema so we could modify it using Node.js
module.exports = mongoose.model("Data", DataSchema);
