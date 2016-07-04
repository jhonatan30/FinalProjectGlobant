var app = angular.module('mySpotify', []);

//Controoler to login with Spotifya account
app.controller('loginController', function($scope, $http)
{
	$scope.login = function () {
    	var client_id = '58f22cb7b5084e31a48a507b2cc73a40';
    	var redirect_uri = 'http://localhost:3000/index.html';
    	var url = 'https://accounts.spotify.com/authorize?client_id=' + client_id +
	        '&response_type=token' +
        	'&scope=user-library-read' +
        	'&redirect_uri=' + encodeURIComponent(redirect_uri);
    	document.location = url;
    }
    $scope.hash = null;
    $scope.hash = location.hash.replace(/#/g, '');    
})

// Search user data profile
app.controller('infoUserController', function($scope, $http)
{
    $scope.infoUser = {
        name: null,
        image: null,
        urlSpotify: null
    }
    $scope.photoHidden = true;

    //If $scope.hash exists, execute method dataUser() to get profile user data
    if($scope.hash)
    {
        ($scope.dataUser = function()
        {
            $http({
                method : 'GET',
                url: 'https://api.spotify.com/v1/me',
                headers: {
                    'Authorization': 'Bearer ' + $scope.hash
                }
            }).success(function(response) {
                $scope.infoUser.name = response.display_name;
                
                $scope.infoUser.image = response.images;
                $scope.infoUser.urlSpotify = response.external_urls.spotify;

            }).error(function(reponse,status){
                if (status == 204) {
                    console.log('No Content: The request has succeeded but returns no message body.')
                    alert('No Content: The request has succeeded but returns no message body.')
                }   
                else if (status == 429) 
                {
                    console.log('Too Many Requests.')            
                    alert('Too Many Requests.') 
                } 
            });
            $scope.photoHidden = false;
        })();
    }
})

// CONTROLLER TAB 1: SEARCH ALBUM AND PLAY FIRST SONG OF ALBUM
app.controller('searchArtistController', function($scope, $http)
{  
    $scope.dataAlbum = {};
    var audioObject = null;

    var searchAlbums = function(query)
    {
        $http({
            method : 'GET',
            url: 'https://api.spotify.com/v1/search',
            params: {
                q: query,
                type: 'album'
            }
        }).success(function(response) {

            $scope.dataAlbum = response.albums.items

        }).error(function(reponse,status){            
            if (status == 204) {
                console.log('No Content: The request has succeeded but returns no message body.')
                alert('No Content: The request has succeeded but returns no message body.')
            }
            else if (status == 429) 
            {
                alert('Too Many Requests.')            
            } 
        });
    }

    $scope.fetchTracks = function (albumId, callback) 
    {
        $http({
            url: 'https://api.spotify.com/v1/albums/' + albumId
        }).success(function (response) {
            callback(response);
        });
    }

    document.getElementById('search-artist').addEventListener('submit', function (e) {
    e.preventDefault();
    searchAlbums(document.getElementById('query').value);
    }, false);

    //Play first song of album selected    
    document.getElementById('cover-albums').addEventListener('click', function (e) 
    {
        var idTrack = (e.target.getAttribute('id'));
        $scope.fetchTracks(idTrack, function (data) 
        {
            if(audioObject == null)
            {
                audioObject = new Audio(data.tracks.items[0].preview_url);
                audioObject.play();

            }else {
                audioObject.pause();
                audioObject = null;
            }
        });
    },false);

})




// CONTROLLER TAB 2: SEARCH ALBUM AND LIST TRACKS
app.controller('searchListController', function($scope, $http)
{
    $scope.dataAlbum = {};
    $scope.listTracks = {};

    $scope.searchAlbums = function(query)
    {
        $http({
            method : 'GET',
            url: 'https://api.spotify.com/v1/search',
            params: {
                q: query,
                type: 'album'
            }
        }).success(function(response) {

            $scope.dataAlbum = response.albums.items
            
        }).error(function(reponse,status){
            if (status == 204) {
                console.log('No Content: The request has succeeded but returns no message body.')
                alert('No Content: The request has succeeded but returns no message body.')
            }
            else if (status == 429) 
            {
                alert('Too Many Requests.')            
            } 
        });
    }


    $scope.getTracks = function(id) 
    {   
        $http({
            method: 'GET',
            url: 'https://api.spotify.com/v1/albums/' + id
        }).success(function(response) {
            
            $scope.listTracks = response.tracks.items;
            
        });
    }  


    document.getElementById('search-artist-tracks').addEventListener('submit', function (e) {
    e.preventDefault();
    $scope.searchAlbums(document.getElementById('queryList').value);
    }, false);


    document.getElementById('cover-albums-tracks').addEventListener('click', function (e) 
    {
        var idTrack = (e.target.getAttribute('id'));
        $scope.getTracks(idTrack);
    },false);
})


//Controller tab 3: random artist
app.controller('randomArtistController', function($scope, $http)
{
    $scope.dataArtist = null;

    $scope.randomArtist = function(year)
    {
        $scope.yearRandom = year;
        $scope.randomNum = (Math.random() * (200 - 1) + 1).toFixed(0);

        $http({
            method : 'GET',
            url: 'https://api.spotify.com/v1/search?q=year%3A' + $scope.yearRandom + 
                 '&type=artist&market=CO&limit=1&offset=' + $scope.randomNum
        }).success(function(response) {
    
            $scope.dataArtist = response.artists.items[0];
            
        }).error(function(reponse,status){
            if (status == 204) {
                console.log('No Content: The request has succeeded but returns no message body.')
                alert('No Content: The request has succeeded but returns no message body.')
            }
            else if (status == 429) 
            {
                alert('Too Many Requests.')            
            } 
        });        
    }

    document.getElementById('search-random-artist').addEventListener('submit', function (e) {
    e.preventDefault();
    $scope.randomArtist(document.getElementById('optionYear').value);
    }, false);
})


//Controller tab 4: show tracks saved in Spotify
app.controller('tracksSadevController', function($scope, $http)
{
    $scope.savedTracks = null;
    ($scope.dataUser = function()
    {
        $http({
            method : 'GET',
            url: 'https://api.spotify.com/v1/me/tracks',
            headers: {
            'Authorization': 'Bearer ' + $scope.hash
            }
        }).success(function(response) {
            $scope.savedTracks = response.items;
            

        }).error(function(reponse,status){
            if (status == 204) {
                console.log('No Content: The request has succeeded but returns no message body.')
                alert('No Content: The request has succeeded but returns no message body.')
            }
            else if (status == 429) 
            {
                alert('Too Many Requests.')            
            } 
        });        
    })();
})


//tab 5 info profile complete
app.controller('profileInfoController', function($scope, $http)
{
    $scope.country = null;
    $scope.name = null;
    $scope.email = null;
    $scope.followers = null;
    $scope.id = null;
    $scope.product = null;
    $scope.user = null;
    $scope.imageProfile = null;
    
    ($scope.getProfileInfo = function()
    {
        $http({
            method : 'GET',
            url: 'https://api.spotify.com/v1/me',
            headers: {
                'Authorization': 'Bearer ' + $scope.hash
            }
        }).success(function(response) {
            $scope.country = response.country;
            $scope.name = response.display_name;
            $scope.email = response.email;
            $scope.followers = response.followers.total;
            $scope.id = response.id;
            $scope.product = response.product;
            $scope.user = response.type;
            $scope.imageProfile = response.images[0].url;
            console.log(response)

        }).error(function(reponse,status){
            if (status == 204) {
                console.log('No Content: The request has succeeded but returns no message body.')
                alert('No Content: The request has succeeded but returns no message body.')
            }
            else if (status == 429) 
            {
                alert('Too Many Requests.')            
            } 
        });
            
    })();
})


//Controller tab selected
app.controller('TabController', function ($scope, $http){
    this.tab = 1;
    
    this.selectTab = function (setTab){
        this.tab = setTab;
    };
    this.isSelected = function(checkTab) {
        return this.tab === checkTab;
    };

    //get access token from url
    $scope.hash = location.hash.replace(/#/g, '');
    $scope.hash = $scope.hash.replace(/access_token=/g, '');
    $scope.hash = $scope.hash.replace(/&token_type=Bearer&expires_in=3600/g, '');
});
