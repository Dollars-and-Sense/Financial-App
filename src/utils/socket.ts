export const socketSubscribe = (email: string, socket: any): void => {
    socket.emit('join', email)
    socket.on('msg', (res: any) => { 
      alert(`New Student Requested to Join a Class!`)
    });
  }
