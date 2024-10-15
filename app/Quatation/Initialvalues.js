import * as Yup from "yup";

const today = new Date().toISOString().split("T")[0];

const initialvalues = {
  Address: "",
  Date: "",
  gstnumber: "",
  kindattention: "",
  reference: "",
  subject: "",
  discount: "",
  transport: "",
  packages: "",
  othercost: "",

  items: [
    {
      description: "",
      hsncode: "",
      qty: "",
      unit: "NOS",
      unitCost: "",
      taxableValue: "",
      taxtype: "CGST",
      percentage: "9",
      taxamt: "",
      typeoftax: "SGST",
      percentage2: "9",
      taxamt2: "",
    },
  ],
};

const validateschema = Yup.object({
  Address: Yup.string().required("address is required"),
  Date: Yup.string().required("date is required"),
  gstnumber: Yup.string().required("gst number is required"),
  kindattention: Yup.string().required("kind attention is required"),
  reference: Yup.string().required("reference is required"),
  subject: Yup.string().required("subject is required"),
  discount: Yup.number().required("discount is required"),
  transport: Yup.number().required("transport is required"),
  packages: Yup.number().required("packages is required"),
  othercost: Yup.number().required("othercost is required"),
  items: Yup.array().of(
    Yup.object().shape({
      description: Yup.string().required("description is required"),
      hsncode: Yup.string().required("hsncode is required"),
      qty: Yup.number().required("qty is required"),
      unit: Yup.string().required("unit is required"),
      unitCost: Yup.number().required("unitCost is required"),
      taxableValue: Yup.number().required("taxableValue is required"),
      taxtype: Yup.string().required("taxtype is required"),
      percentage: Yup.number().required("percentage is required"),
      taxamt: Yup.number().required("taxamt is required"),
      typeoftax: Yup.string().required("typeoftax is required"),
      percentage2: Yup.number().required("percentage2 is required"),
      taxamt2: Yup.number().required("taxamt2 is required"),
    })
  ),
});


    export { initialvalues, validateschema};
