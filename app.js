const tweetFeed = document.getElementById('tweet-feed');

async function loadTimeline(){
    try{
        console.log("Fetching timeline from Java........");

        const response = await fetch('http://localhost:8080/get-all-tweets');
        const tweetsArray = await response.json();

        tweetFeed.innerHTML = "";

        for(let i = 0; i< tweetsArray.length; i++){
            const tweet = tweetsArray[i];

            const tweetHTML = `
                <article class="post" data-tweet-id="${tweet.id}">
                <div class="icono">C</div>
                <div class ="contenido-post">
                    <div>
                        <span class="nombre">User ${tweet.user ? tweet.user.id : "Unknown"}</span>
                        <span class="usuario">@user_${tweet.user ? tweet.user.id : "unknown"}</span>
                        <span class="tiempo">· Just now</span>
                    </div>
                    <p>${tweet.content}</p>
                    <ul class = "icons">
                        <li>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 0 1 1.037-.443 48.282 48.282 0 0 0 5.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" /></svg>
                            <span>0</span>
                        </li>
                        <li>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 0 0-3.7-3.7 48.678 48.678 0 0 0-7.324 0 4.006 4.006 0 0 0-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 0 0 3.7 3.7 48.656 48.656 0 0 0 7.324 0 4.006 4.006 0 0 0 3.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3-3 3" /></svg>
                            <span>0</span>
                        </li>
                        <li class="dynamic-like-btn">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6"><path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" /></svg>
                            <span>${tweet.likes}</span>
                        </li>
                        <li>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6"><path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" /></svg>
                            <span>0</span>
                        </li>
                    </ul>
                </div>
            </article>
            `;

            tweetFeed.innerHTML += tweetHTML;
        }

        const allLikeButtons = document.querySelectorAll('.dynamic-like-btn');

        for(let j = 0; j < allLikeButtons.length; j++){
            const button = allLikeButtons[j];

            button.addEventListener('click', async function(){
                const parentArticle = button.closest('.post');
                const actualTweetId = parentArticle.getAttribute('data-tweet-id');
                console.log("Clicked Like on Tweet ID:", actualTweetId);

                try{
                    const updateResponse = await fetch(`http://localhost:8080/tweets/${actualTweetId}/like`,{
                        method: 'PUT'
                    });
                    const updatedTweet = await updateResponse.json();
                    
                    const heartIcon = button.querySelector('svg');
                    const likeCountText = button.querySelector('span');

                    heartIcon.style.fill = "red";
                    heartIcon.style.color = "red";
                    likeCountText.innerText = updatedTweet.likes;
                } catch(error){
                    console.error("Error liking tweet:",error);
                }
            });
        }
    } catch(error){
        console.error("Error loading timeline", error);
    }
}
loadTimeline();


const tweetInput = document.getElementById('tweet-input');
const publishBtn = document.getElementById('publish-btn');

publishBtn.addEventListener('click', async function(){
    const textContent = tweetInput.value;

    if(textContent.trim()===""){
        return;
    }

    const newTweetData ={
        content: textContent,
        user: {
            id: 1
        }
    };
    
    try{
        console.log("Sending brand new tweet to Java...");

        const response = await fetch('http://localhost:8080/tweets',{
            method: 'POST',

            headers:{
                'Content-Type': 'application/json'
            },

            body: JSON.stringify(newTweetData)
        });

        if(response.ok){
            console.log("Tweet saved to PostgreSQL successfully");

            tweetInput.value = "";

            loadTimeline();
        }
    } catch(error){
        console.error("Error publishing tweet:", error);
    }
});

