// Set the URL equal to jsforwp_globals.rest_url
var   container = document.getElementById( 'main' ),
      wpRestUrl = jsforwp_globals.rest_url;

(function init(){

    getPosts();

})();

function getPosts() {

    axios({
        method: 'get',
        url: wpRestUrl + 'wp/v2/posts',
        params: {
            per_page: 3
        }
    })
        .then( function( response ) {

            container.innerHTML = '';

            for( let post of response.data ) {
                renderPost( post );
            }

            var links = document.querySelectorAll( '#main h2 a' );
            for( let link of links ) {
                link.addEventListener( 'click', getPost );
            }

        });

}

function renderPost( post ) {

    var h2 = document.createElement( 'h2' ),
        markup = '';

    markup += `<a href="#${post.link}" data-id="${post.id}">`;
    markup += post.title.rendered;
    markup += '</a>';

    h2.innerHTML = markup;
    container.appendChild( h2 );

}

function getPost( event ) {

    let id = event.target.dataset.id;

    axios({
        method: 'get',
        url: wpRestUrl + 'wp/v2/posts/' + id
    })
        .then( function( response ) {

            // Clear the page
            container.innerHTML = '';

            // Pass response.data as a parameter to the renderFullPost function
            renderFullPost( response.data );
        });

}

function renderFullPost( post ) {

    let article = document.createElement('article'),
        markup = '';

    article.classList.add( 'post' );

    markup += '<p><a class="back" href="#">Go Back</a></p>';
    markup += `<h1>${post.title.rendered}</h1>`;
    markup += `<div class="entry-content">${post.content.rendered}</div>`;

    article.innerHTML = markup;

    article.querySelector( '.back' ).addEventListener( 'click', getPosts );

    container.appendChild( article );

}
