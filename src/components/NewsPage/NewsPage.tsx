import React, { useState, useEffect } from 'react';
import './NewsPage.css';

interface NewsArticle {
  source: {
    id: string | null;
    name: string;
  };
  author: string | null;
  title: string;
  description: string;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string;
}

function NewsPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setLoading(true);
      // Sử dụng NewsAPI.org - API key miễn phí
      const response = await fetch(
        // 'https://newsapi.org/v2/everything?q=technology&language=vi&sortBy=publishedAt&apiKey=YOUR_API_KEY'
        'https://newsapi.org/v2/everything?q=technology&language=vi&sortBy=publishedAt&apiKey=f827a02774b74fe4aa6e80bf3b1e2ef4'
      );
      
      if (!response.ok) {
        throw new Error('Không thể lấy tin tức');
      }
      
      const data = await response.json();
      setArticles(data.articles || []);
    } catch (err) {
      setError('Có lỗi xảy ra khi tải tin tức');
      console.error('Error fetching news:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="news-page">
        <div className="news-loading">
          <div className="spinner"></div>
          <p>Đang tải tin tức...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="news-page">
        <div className="news-error">
          <h3>Không thể tải tin tức</h3>
          <p>{error}</p>
          <button onClick={fetchNews} className="retry-btn">
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="news-page">
      <div className="news-header">
        <h1>Tin Công Nghệ Mới Nhất</h1>
        <p>Cập nhật những tin tức công nghệ hot nhất</p>
      </div>
      
      <div className="news-grid">
        {articles.map((article, index) => (
          <div key={index} className="news-card">
            {article.urlToImage && (
              <div className="news-image">
                <img 
                  src={article.urlToImage} 
                  alt={article.title}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}
            <div className="news-content">
              <h3 className="news-title">{article.title}</h3>
              <p className="news-description">{article.description}</p>
              <div className="news-meta">
                <span className="news-source">{article.source.name}</span>
                <span className="news-date">{formatDate(article.publishedAt)}</span>
              </div>
              <a 
                href={article.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="news-link"
              >
                Đọc thêm →
              </a>
            </div>
          </div>
        ))}
      </div>
      
      <div className="news-footer">
        <p>Nguồn tin: NewsAPI.org</p>
        <p>Dữ liệu được cập nhật tự động</p>
      </div>
    </div>
  );
}

export default NewsPage; 