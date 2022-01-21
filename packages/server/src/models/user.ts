import mongoose, { PassportLocalModel } from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';

const User = new mongoose.Schema(
	{
		firstname: {
			type: String,
			default: '',
		},
		lastname: {
			type: String,
			default: '',
		},
		email: String,
		facebookId: String,
		access: {
			type: Number,
			default: 0,
			min: 0,
			max: 5,
		},
		birthday: {
			type: Date,
			default: Date.now(),
		},
		description: {
			type: String,
			default: '',
		},
		flair: {
			type: String,
			default: '',
		},
	},
	{
		timestamps: true,
	}
);

User.plugin(passportLocalMongoose, { session: false });

export default mongoose.model<string, any, PassportLocalModel<any>>('User', User);