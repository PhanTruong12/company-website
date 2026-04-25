import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import DOMPurify from 'dompurify';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import { blogApi } from '../api';
import type { BlogPost } from '../types';
import { subscribeBlogUpdated } from '../../../utils/blogSync';

interface PostDetailProps {
  postIdOrSlug: string;
}

const YOUTUBE_REGEX = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{6,})/i;
const VIDEO_FILE_REGEX = /\.(mp4|webm|ogg)(\?.*)?$/i;
const HTML_CONTENT_REGEX = /<\/?[a-z][\s\S]*>/i;

const getYoutubeEmbedUrl = (url: string): string | null => {
  const match = url.match(YOUTUBE_REGEX);
  if (!match) return null;
  return `https://www.youtube.com/embed/${match[1]}`;
};

const sanitizeBlogHtml = (html: string) =>
  DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true },
    ADD_TAGS: ['iframe', 'video', 'source'],
    ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling', 'controls', 'src', 'type'],
  });

export const PostDetail = ({ postIdOrSlug }: PostDetailProps) => {
  const queryClient = useQueryClient();
  const postQuery = useQuery({
    queryKey: ['blog-post', postIdOrSlug],
    queryFn: () => blogApi.getPostById(postIdOrSlug),
  });

  const reactMutation = useMutation({
    mutationFn: (type: 'like' | 'dislike') => {
      if (!postQuery.data?._id) throw new Error('Không tìm thấy ID bài viết');
      return blogApi.reactPost(postQuery.data._id, type);
    },
    onMutate: async (type) => {
      await queryClient.cancelQueries({ queryKey: ['blog-post', postIdOrSlug] });
      const previousPost = queryClient.getQueryData<BlogPost>(['blog-post', postIdOrSlug]);

      if (previousPost) {
        queryClient.setQueryData<BlogPost>(['blog-post', postIdOrSlug], {
          ...previousPost,
          likes: previousPost.likes + (type === 'like' ? 1 : 0),
          dislikes: previousPost.dislikes + (type === 'dislike' ? 1 : 0),
        });
      }

      return { previousPost };
    },
    onError: (_error, _value, context) => {
      if (context?.previousPost) {
        queryClient.setQueryData(['blog-post', postIdOrSlug], context.previousPost);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-post', postIdOrSlug] });
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
    },
  });

  useEffect(() => {
    const unsubscribe = subscribeBlogUpdated((payload) => {
      if (!payload.postId) return;
      if (payload.postId !== postQuery.data?._id) return;

      if (payload.action === 'deleted') {
        queryClient.invalidateQueries({ queryKey: ['blog-post', postIdOrSlug] });
        queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
        return;
      }

      if (payload.post) {
        queryClient.setQueryData(['blog-post', postIdOrSlug], payload.post);
      }
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
    });
    return unsubscribe;
  }, [postIdOrSlug, postQuery.data?._id, queryClient]);

  if (postQuery.isLoading) {
    return <p className="blog-filter-meta">Đang tải chi tiết bài viết...</p>;
  }

  if (postQuery.error || !postQuery.data) {
    return <p className="blog-filter-meta">Không thể tải bài viết này.</p>;
  }

  const post = postQuery.data;

  return (
    <article className="blog-detail-card">
      <div className="blog-detail-head">
        <p className="blog-detail-date">
          Đăng lúc: {new Date(post.createdAt).toLocaleString('vi-VN')}
        </p>
        <h1 className="blog-detail-title">{post.title}</h1>
        {post.coverImage ? <img src={post.coverImage} alt={post.title} className="blog-detail-cover" /> : null}
      </div>

      <div className="blog-detail-body">
        <div className="blog-detail-meta">
          <span className="blog-meta-chip views">
            👁 {post.views} lượt xem
          </span>
          <span className="blog-meta-chip likes">
            👍 {post.likes} thích
          </span>
          <span className="blog-meta-chip dislikes">
            👎 {post.dislikes} không thích
          </span>
        </div>

        <div className="blog-actions">
        <button
          type="button"
          onClick={() => reactMutation.mutate('like')}
          disabled={reactMutation.isPending}
          className="blog-action-btn like"
        >
          👍 Thích bài này
        </button>
        <button
          type="button"
          onClick={() => reactMutation.mutate('dislike')}
          disabled={reactMutation.isPending}
          className="blog-action-btn dislike"
        >
          👎 Không thích
        </button>
        {reactMutation.isPending && <span className="blog-updating">Đang cập nhật...</span>}
      </div>

        <div className="prose blog-markdown">
          {HTML_CONTENT_REGEX.test(post.content) ? (
            <div className="blog-rich-content" dangerouslySetInnerHTML={{ __html: sanitizeBlogHtml(post.content) }} />
          ) : (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeSanitize]}
              components={{
                a: ({ href = '', children }) => {
                  const youtubeEmbedUrl = getYoutubeEmbedUrl(href);
                  if (youtubeEmbedUrl) {
                    return (
                      <span className="blog-embed youtube">
                        <iframe
                          src={youtubeEmbedUrl}
                          title="Video YouTube"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                        />
                      </span>
                    );
                  }

                  if (VIDEO_FILE_REGEX.test(href)) {
                    return (
                      <span className="blog-embed video-file">
                        <video controls preload="metadata">
                          <source src={href} />
                          Trình duyệt không hỗ trợ video.
                        </video>
                      </span>
                    );
                  }

                  return (
                    <a href={href} target="_blank" rel="noreferrer">
                      {children}
                    </a>
                  );
                },
              }}
            >
              {post.content}
            </ReactMarkdown>
          )}
        </div>
      </div>
    </article>
  );
};
