import { tweetsData} from "./data.js"
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

// Detect Clicks on the entire document
document.addEventListener('click', function(event){
    if(event.target.dataset.like){
        handleLikeClick(event.target.dataset.like)
    }
    else if (event.target.dataset.retweet){
        handleRetweetClick(event.target.dataset.retweet)
    }
    else if(event.target.dataset.reply) {
        handleReplyClick(event.target.dataset.reply)
    }
    else if (event.target.id === "tweet-btn"){
        handleTweetBtnClick()
    }
})
function handleTweetBtnClick(){
    const tweetInput = document.getElementById("tweet-input")
    if (tweetInput.value){
        let newTweet = {
            handle: `@Jonathan-Scruggs`,
            profilePic: `images/scrimbalogo.png`,
            likes: 0,
            retweets: 0,
            tweetText: tweetInput.value,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            uuid: uuidv4()
        }
        tweetsData.unshift(newTweet)
        tweetInput.value  = ""
        render() // After we push the new data rerender the feed
    }
}


function handleLikeClick(tweetUUID){
    const targetTweetObject = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetUUID
    })[0]
    if (!targetTweetObject.isLiked){
        targetTweetObject.likes++
        /*Since the object is mutable type the change is reflected in data.js
        thus we can just call render() again to reflect the change in the users
        browser!*/
        }
    else {
        targetTweetObject.likes--
    }
    targetTweetObject.isLiked = !targetTweetObject.isLiked 
    // Flipping the boolean since it will have to be flipped regardless of whether we liked or not
    render()
}

function handleRetweetClick(tweetUUID){
    const targetTweetObject = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetUUID
    })[0]
    if (targetTweetObject.isRetweeted){
        targetTweetObject.retweets--
    }
    else{
        targetTweetObject.retweets++
    }
    targetTweetObject.isRetweeted = !targetTweetObject.isRetweeted
    render()

}
function handleReplyClick(tweetUUID){
    document.getElementById(`replies-${tweetUUID}`).classList.toggle("hidden")
}

function getFeedHtml(){
    let feedHtml = ""
    tweetsData.forEach(function(tweet){
        let isLiked = ""
        let isRetweeted = ""
        if (tweet.isLiked){
            isLiked = "liked"
        }
        if (tweet.isRetweeted){
            isRetweeted = "retweeted"
        }
        let repliesHtml = ''

        if(tweet.replies.length){
            tweet.replies.forEach(function(reply){
                repliesHtml += 
                `<div class="tweet-reply">
                    <div class="tweet-inner">
                        <img src="${reply.profilePic}" class="profile-pic">
                            <div>
                                <p class="handle">${reply.handle}</p>
                                <p class="tweet-text">${reply.tweetText}</p>
                            </div>
                    </div>
                </div>`



            })


        }

        feedHtml += 
        `<div class="tweet">
            <div class="tweet-inner">
                <img src="${tweet.profilePic}" class="profile-pic">
                <div>
                    <p class="handle">${tweet.handle}</p>
                    <p class="tweet-text">${tweet.tweetText}</p>
                    <div class="tweet-details">
                        <span class="tweet-detail">
                            <i class="fa-regular fa-comment-dots " 
                            data-reply="${tweet.uuid}"></i>
                            ${tweet.replies.length}
                        </span>
                        <span class="tweet-detail">
                            <i class="fa-solid
                            fa-heart
                            ${isLiked}" 
                                data-like="${tweet.uuid}"></i>
                            ${tweet.likes}
                        </span>
                        <span class="tweet-detail">
                            <i class="fa-solid fa-retweet
                            ${isRetweeted}"
                            data-retweet="${tweet.uuid}"></i>
                            ${tweet.retweets} 
                        </span>
                    </div>   
                </div>            
            </div>
            <div class="hidden" id="replies-${tweet.uuid}">
                ${repliesHtml}</div>
        </div>`
    })
    return feedHtml
}
function render(){
    document.getElementById("feed").innerHTML = getFeedHtml()
}   
render()