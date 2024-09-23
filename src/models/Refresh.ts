import { model, Schema } from 'mongoose';

const tokenSchema = new Schema(
  {
    userid: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    token: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Refresh = model('Refresh', tokenSchema);
export default Refresh;
