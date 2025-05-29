--- 1 ---
INSERT INTO ACCOUNT (
        ACCOUNT_FIRSTNAME,
        ACCOUNT_LASTNAME,
        ACCOUNT_EMAIL,
        ACCOUNT_PASSWORD
    )
VALUES (
        'Tony',
        'Stark',
        'tony@starkent.com',
        'Iam1ronM@n'
    );
--- 2 ---
UPDATE ACCOUNT
SET ACCOUNT_TYPE = 'Admin'
WHERE ACCOUNT_ID = 1;
--- 3 ---
DELETE FROM ACCOUNT
WHERE ACCOUNT_ID = 1;
--- 4 ---
UPDATE INVENTORY
SET INV_DESCRIPTION = REPLACE(
        INV_DESCRIPTION,
        'small interiors',
        'a huge interior'
    )
WHERE INV_ID = 10;
--- 5 ---
SELECT I.INV_MAKE,
    I.INV_MODEL,
    C.CLASSIFICATION_NAME
FROM INVENTORY I
    INNER JOIN CLASSIFICATION C ON I.CLASSIFICATION_ID = C.CLASSIFICATION_ID
WHERE C.CLASSIFICATION_NAME = 'Sport';
--- 6 ---
UPDATE INVENTORY
SET INV_IMAGE = REPLACE(INV_IMAGE, '/images/', '/images/vehicles/'),
    INV_THUMBNAIL = REPLACE(INV_THUMBNAIL, '/images/', '/images/vehicles/');