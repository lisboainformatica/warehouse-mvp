import mongoose, { Schema } from "mongoose";

const SupplierSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, "Por favor informe o Nome Fantasia."],
            maxlength: [60, "Nome não pode ter mais de 60 caracteres"],
        },
        corporateName: {
            type: String,
            required: [true, "Por favor informe a Razão Social."],
            maxlength: [100, "Razão Social muito longa"],
        },
        cnpj: {
            type: String,
            required: [true, "Por favor informe o CNPJ."],
            maxlength: [18, "CNPJ muito longo"],
        },
        contactPerson: {
            type: String,
            maxlength: [60, "Nome do responsável muito longo"],
        },
        contactInfo: {
            type: String,
            maxlength: [100, "Informação de contato muito longa"],
        },
    },
    { timestamps: true }
);

export default mongoose.models.Supplier ||
    mongoose.model("Supplier", SupplierSchema);
