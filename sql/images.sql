DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS images;

/*
The image table
*/


CREATE TABLE images
(
    id SERIAL PRIMARY KEY,
    url VARCHAR NOT NULL,
    username VARCHAR NOT NULL,
    title VARCHAR NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

/*
The insert INTO images
*/

INSERT INTO images
    (url, username, title, description)
VALUES
    (
        'https://s3.amazonaws.com/spicedling/jAVZmnxnZ-U95ap2-PLliFFF7TO0KqZm.jpg',
        'funkychicken',
        'Welcome to Spiced and the Future!',
        'This photo brings back so many great memories.'
);

INSERT INTO images
    (url, username, title, description)
VALUES
    (
        'https://s3.amazonaws.com/spicedling/wg8d94G_HrWdq7bU_2wT6Y6F3zrX-kej.jpg',
        'discoduck',
        'Elvis',
        'We can''t go on together with suspicious minds.'
);

INSERT INTO images
    (url, username, title, description)
VALUES
    (
        'https://s3.amazonaws.com/spicedling/XCv4AwJdm6QuzjenFPKJocpipRNNMwze.jpg',
        'discoduck',
        'To be or not to be',
        'That is the question.'
);
/*
The comments table
*/
CREATE TABLE comments
(
    id SERIAL PRIMARY KEY,
    username VARCHAR NOT NULL,
    comment VARCHAR NOT NULL,
    image_id INTEGER NOT NULL REFERENCES images(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
/*
The insert INTO comments
*/
INSERT INTO comments
    (username, comment, image_id)
VALUES
    (
        'hussein',
        'making some comments here',
        1
);