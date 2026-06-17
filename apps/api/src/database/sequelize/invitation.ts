import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize'

import { sequelize } from './client'

export class Invitation extends Model<
  InferAttributes<Invitation>,
  InferCreationAttributes<Invitation>
> {
  declare userId: number

  declare token: string
}

Invitation.init(
  {
    userId: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    token: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      primaryKey: true,
    },
  },
  {
    sequelize,
    tableName: 'invitations',
    createdAt: false,
    updatedAt: false,
  },
)