import bcrypt from 'bcrypt';

const hashPass = async (password) => bcrypt.hash(password, 12);

const verifyPass = async (password, encPass) => bcrypt.compare(password, encPass);

export { hashPass, verifyPass };
