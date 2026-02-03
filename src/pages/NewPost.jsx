import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";
import BottomNavigation from "../components/layout/BottomNavigation";
import NewPostForm from "../components/forms/NewPostForm";
import { useMutation } from "@apollo/client/react";
import { ADD_FEED_POST } from "../service/graphql/mutations/feed";
import { GET_FEED_BY_CATEGORY, GET_FEEDS } from "../service/graphql/queries";

function NewPost({ onNavigateToFeed }) {
  const [addFeedPost, { loading }] = useMutation(ADD_FEED_POST, {
    refetchQueries: [
      {
        query: GET_FEEDS,
      },
      {
        query: GET_FEED_BY_CATEGORY,
      },
    ],
    update(cache, { data: { createFeed } }) {
      try {
        const existingFeed = cache.readQuery({ query: GET_FEEDS });
        if (existingFeed) {
          cache.writeQuery({
            query: GET_FEEDS,
            data: {
              ...existingFeed,
              allFeeds: [...existingFeed.allFeeds, createFeed],
            },
          });
        }
      } catch (error) {
        console.warn("Erro ao salvar feed no cache:", error);
      }

      try {
        const existingCategoryFeed = cache.readQuery({
          query: GET_FEED_BY_CATEGORY,
          variables: { category: createFeed.category },
        });
        if (existingCategoryFeed) {
          cache.writeQuery({
            query: GET_FEED_BY_CATEGORY,
            variables: { category: createFeed.category },
            data: {
              feedByCategory: [
                createFeed,
                ...existingCategoryFeed.feedByCategory,
              ],
            },
          });
        }
      } catch (error) {
        console.warn("Erro ao salvar feed por categoria no cache:", error);
      }
    },
  });

  const handleSubmit = async (formData) => {
    const formParam = {
      user: {
        id: 2,
        name: "Ana Silva Correia",
      },
      time: parseInt(formData.tempo) * 60, // convertendo minutos para segundos
      stats: {
        distance: formData.distancia + "Km",
        calories: formData.calorias,
        heartRate: formData.bpm + "BPM",
      },
      description: formData.descricao,
      timestamp: new Date().toISOString(),
      category: formData.tipoTreino,
    };
    try {
      await addFeedPost({
        variables: formParam,
      });
      onNavigateToFeed?.();
    } catch (error) {
      console.error("Erro ao adicionar postagem:", error);
    }
  };

  const handleCancel = () => {
    onNavigateToFeed?.();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="flex">
        {/* Desktop Sidebar */}
        <Sidebar activeItem="feed" />

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 pb-20 md:pb-6">
          <div className="max-w-4xl mx-auto">
            <NewPostForm
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              loading={loading}
            />
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNavigation activeItem="feed" />
    </div>
  );
}

export default NewPost;
