// Lightweight registry for the Socket.IO instance so controllers can broadcast updates.
let ioInstance = null;

export const setIo = (io) => {
    ioInstance = io;
};

export const getIo = () => ioInstance;