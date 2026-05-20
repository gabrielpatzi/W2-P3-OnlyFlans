import User from './user.model.js';
import CreatorProfile from './creatorProfile.model.js';
import Goal from './goal.model.js';
import Post from './post.model.js';
import Comment from './comment.model.js';
import Donation from './donation.model.js';
import Favorite from './favorite.model.js';

// ─── User ↔ CreatorProfile (1:1) ─────────────────────────────────────────────
User.hasOne(CreatorProfile, { foreignKey: 'userId', as: 'creatorProfile' });
CreatorProfile.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// ─── User (creador) ↔ Goals (1:N) ────────────────────────────────────────────
User.hasMany(Goal, { foreignKey: 'userId', as: 'goals' });
Goal.belongsTo(User, { foreignKey: 'userId', as: 'creator' });

// ─── User (creador) ↔ Posts (1:N) ────────────────────────────────────────────
User.hasMany(Post, { foreignKey: 'userId', as: 'posts' });
Post.belongsTo(User, { foreignKey: 'userId', as: 'creator' });

// ─── Post ↔ Comments (1:N) ───────────────────────────────────────────────────
Post.hasMany(Comment, { foreignKey: 'postId', as: 'comments' });
Comment.belongsTo(Post, { foreignKey: 'postId', as: 'post' });

// ─── User (seguidor) ↔ Comments (1:N) ────────────────────────────────────────
User.hasMany(Comment, { foreignKey: 'userId', as: 'comments' });
Comment.belongsTo(User, { foreignKey: 'userId', as: 'follower' });

// ─── Donations ────────────────────────────────────────────────────────────────
// Un seguidor puede hacer muchas donaciones
User.hasMany(Donation, { foreignKey: 'followerId', as: 'donationsMade' });
Donation.belongsTo(User, { foreignKey: 'followerId', as: 'follower' });

// Un creador puede recibir muchas donaciones
User.hasMany(Donation, { foreignKey: 'creatorId', as: 'donationsReceived' });
Donation.belongsTo(User, { foreignKey: 'creatorId', as: 'creator' });

// ─── Favorites ────────────────────────────────────────────────────────────────
User.belongsToMany(User, {
    through: Favorite,
    foreignKey: 'followerId',
    otherKey: 'creatorId',
    as: 'favoriteCreators'
});
User.belongsToMany(User, {
    through: Favorite,
    foreignKey: 'creatorId',
    otherKey: 'followerId',
    as: 'favoritedBy'
});

export { User, CreatorProfile, Goal, Post, Comment, Donation, Favorite };
