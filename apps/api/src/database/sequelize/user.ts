import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize'

import { sequelize } from './client'

export class User extends Model<
  InferAttributes<User>,
  InferCreationAttributes<User>
> {
  declare id: CreationOptional<number>

  declare name: string

  declare avatar: string | null

  declare email: string

  declare passwordHash: string | null

  declare features: bigint
}

User.init(
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      defaultValue: () => Date.now(),
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    features: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0,
    },
    avatar: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'users',
    createdAt: false,
    updatedAt: false,
  },
)