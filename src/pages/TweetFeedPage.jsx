import { useState, useEffect } from 'react'

// TODO: Fetch tweets from backend
// TODO: Implement create new tweet
// TODO: Add like/retweet functionality
// TODO: Implement tweet replies
// TODO: Add infinite scroll or pagination
// TODO: Implement delete tweet for own tweets

const TweetFeedPage = () => {
  const [tweets, setTweets] = useState([])
  const [loading, setLoading] = useState(false)
  const [tweetContent, setTweetContent] = useState('')
  const [isPosting, setIsPosting] = useState(false)

  useEffect(() => {
    // TODO: Fetch tweets from /api/tweets
    const fetchTweets = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/tweets')
        const data = await response.json()
        setTweets(data.data)
      } catch (error) {
        console.error('Error fetching tweets:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchTweets()
  }, [])

  const handlePostTweet = async () => {
    if (!tweetContent.trim()) return
    // TODO: Send tweet creation request to /api/tweets
    const response = await fetch('/api/tweets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: tweetContent })
    })
    setTweetContent('')
  }

  const handleLikeTweet = (tweetId) => {
    // TODO: Send like request to /api/tweets/:tweetId/like
  }

  const handleRetweetTweet = (tweetId) => {
    // TODO: Send retweet request to /api/tweets/:tweetId/retweet
  }

  const handleDeleteTweet = (tweetId) => {
    // TODO: Send delete request to /api/tweets/:tweetId
  }

  return (
    <div className="tweet-feed-page">
      <div className="tweet-compose">
        <h2>What's happening?!</h2>
        <textarea
          value={tweetContent}
          onChange={(e) => setTweetContent(e.target.value)}
          placeholder="Share your thoughts..."
          rows="4"
        />
        <button onClick={handlePostTweet} disabled={isPosting || !tweetContent.trim()}>
          {isPosting ? 'Posting...' : 'Post Tweet'}
        </button>
      </div>

      <div className="tweets-feed">
        {loading ? (
          <p>Loading tweets...</p>
        ) : tweets.length > 0 ? (
          tweets.map((tweet) => (
            <div key={tweet._id} className="tweet-item">
              <div className="tweet-header">
                <img src={tweet.owner?.avatar} alt="User avatar" className="tweet-avatar" />
                <div>
                  <strong>{tweet.owner?.username}</strong>
                  <span>@{tweet.owner?.username}</span>
                  <span>• {tweet.createdAt}</span>
                </div>
              </div>
              <p className="tweet-content">{tweet.content}</p>
              <div className="tweet-actions">
                <button onClick={() => handleLikeTweet(tweet._id)}>
                  ❤️ {tweet.likeCount || 0}
                </button>
                <button onClick={() => handleRetweetTweet(tweet._id)}>
                  🔄 {tweet.retweetCount || 0}
                </button>
                <button onClick={() => handleDeleteTweet(tweet._id)}>
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No tweets yet. Be the first to post!</p>
        )}
      </div>
    </div>
  )
}

export default TweetFeedPage
