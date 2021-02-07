const spicedPg = require('spiced-pg');
const db = spicedPg(
	process.env.DATABASE_URL ||
		'postgres:postgres:postgres@localhost:5432/imageboard'
);

/**
 * ***************+
 * ****************
 * GET-IMAGES
 */
module.exports.getImages = () => {
	return db.query(`SELECT * FROM images ORDER BY id DESC LIMIT 6;`);
};
/**
 * ***************+
 * ****************
 * more-IMAGES
 */
module.exports.moreImages = (id) => {
	return db.query(
		`SELECT *, (
            SELECT id FROM images ORDER BY id ASC LIMIT 1
        ) AS lowest_id FROM images WHERE id < $1 ORDER BY id DESC LIMIT 6;`,
		[id]
	);
};
/**
 * ***************+
 * ****************
 * GET-Info
 */
module.exports.getInfo = (url, username, title, description) => {
	return db.query(
		`
        INSERT INTO images (url, username, title, description)
        VALUES ($1,$2,$3,$4) RETURNING *`,
		[url, username, title, description]
	);
};
/**
 * ***************+
 * ****************
 * GET-IMAGES
 */
module.exports.getImage = (id) => {
	return db.query(`SELECT * FROM images WHERE id = $1;`, [id]);
};
/**
 * ***************+
 * ****************
 * Comment-Database
 */
module.exports.commentDb = (id) => {
	return db.query(
		`SELECT * FROM comments WHERE image_id = $1 ORDER BY id DESC;`,
		[id]
	);
};
/**
 * ***************+
 * ****************
 * Add-Comment
 */
module.exports.addComment = (username, comment, image_id) => {
	return db.query(
		`INSERT INTO comments (username, comment, image_id) VALUES ($1, $2, $3) RETURNING *;`,
		[username, comment, image_id]
	);
};
