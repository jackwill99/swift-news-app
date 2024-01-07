import { Schema, SchemaOptions } from "@nestjs/mongoose";
import { PipelineStage } from "mongoose";

export const SchemaDefault = (
  options?: SchemaOptions,
  toJsonTransform?: (ret: { [key: string]: any }) => { [key: string]: any },
) =>
  Schema({
    timestamps: true,
    toJSON: {
      transform: function (doc, ret, opt) {
        let modifiedRet: { [key: string]: any } = { id: ret._id, ...ret };

        delete modifiedRet["_id"];
        delete modifiedRet["updatedAt"];
        delete modifiedRet["createdAt"];
        delete modifiedRet["delete"];
        delete modifiedRet["__v"];

        if (toJsonTransform != undefined) {
          modifiedRet = toJsonTransform(modifiedRet);
        }

        return modifiedRet;
      },
    },
    ...options,
  });

export const aggregateFacetOperation = (extraProject?: {
  [key: string]: 0 | 1;
}): PipelineStage.FacetPipelineStage[] => [
  {
    $addFields: {
      id: "$_id",
    },
  },
  {
    $project: {
      updatedAt: 0,
      createdAt: 0,
      delete: 0,
      __v: 0,
      _id: 0,
      ...extraProject,
    },
  },
];
