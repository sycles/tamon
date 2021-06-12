const { Schema, model } = require('mongoose');

class User {
    constructor({client, user, model}) {
        this.client = client;
        this.user = user;
        this.model = model;
    }

    async save() {
        this.model.markModified('profile.commands.cooldowns');
        await this.model.save();
        return;
    }
}

const Users = Schema({
    id: String,
    profile: {
        pocket: {
            amount: {
                type: Number,
                default: 500
            },
            max: {
                type: Number,
                default: 5000000
            }
        },
        bank: {
            amount: {
                type: Number,
                default: 0
            },
            max: {
                type: Number,
                default: 5000000
            }
        },
        commands: {
            work: {
                job: {
                    type: String,
                    default: "Voice Actor"
                },
                earned: {
                    type: Number,
                    default: 0
                },
                count: {
                    type: Number,
                    default: 0
                },
                successes: {
                    type: Number,
                    default: 0
                },
                fails: {
                    type: Number,
                    default: 0
                }
            },
            beg: {
                count: {
                    type: Number,
                    default: 0
                },
                earned: {
                    type: Number,
                    default: 0
                }
            },
            cooldowns: {
                type: Object,
                default: {
                    work: 0
                }
            }
        }
    }
});

module.exports = {
    User,
    UserSchema: model("users", Users)
}