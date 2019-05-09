module.exports = function (io) {
    io.on('connection', (socket) => {
        socket.on('refresh', (data) => {
            io.emit('refreshPage', data);
        });

        socket.on('comment', data => {
            io.emit('commentPage', data);
        });

        socket.on('like', data => {
            io.emit('likePage', data);
        });

        socket.on('delete', data => {
            io.emit('deletePage', data);
        });

        socket.on('deleteComment', data => {
            io.emit('deleteCommentPage', data);
        });
    });
}