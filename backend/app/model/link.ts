import { Model, DataTypes, Optional } from "sequelize";
import sequelize from "./dbconfig";

type LinkAttributes = {
  id: number;
  title: string;
  url: string;
}

type LinkCreationAttributes = Optional<LinkAttributes, "id">;

class Link extends Model<LinkAttributes, LinkCreationAttributes>
  implements LinkAttributes {
  public id!: number;
  public title!: string;
  public url!: string;
  null: any;
}

Link.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
    },
    url: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    modelName: "link",
    timestamps: false,
  }
);

export default Link;