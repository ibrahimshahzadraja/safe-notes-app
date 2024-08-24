import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const favoriteSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    noteId: {
        type: Schema.Types.ObjectId,
        ref: "Note",
        required: true
    }
}, {timestamps: true})

favoriteSchema.plugin(mongooseAggregatePaginate)

export const Favorite = mongoose.model("Favorite", favoriteSchema)