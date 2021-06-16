var artists = [];

fetch('https://api.spotify.com/v1/me/following?type=artist&limit=50', {
    method: 'GET', headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + "BQDIEGU9Bw7KGfSwhyBIOEAUcqPgCtVzgh8DQO9qpCVSYyqD9O8ROUy2YbNwLQ5Vt7tD9isg8gxdOC1hYjXBkDqNfzqjsjVXXAqDLudAAYyMPBKHbkDybIGKtRIYw-hzB1YDg96FK7msWex6rG2z07n5bcoe"
    }
    })
    .then(function(response){
        if (response.ok){
            response.json().then(function(data){
                for (x=0;x<30;x++){
                    if (!data.artists.items[x].name){
                        return;
                    }else{
                        console.log(data.artists.items[x].name);
                    }
                }
            });
        };
    });

    fetch("https://api.music.apple.com/v1/me/library/search?term=U2&types=library-artists")
        .then(function(response){
            response.json().then(function(data){
                console.log(data);
            })
        })