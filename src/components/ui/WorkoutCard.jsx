import { useMutation } from "@apollo/client/react";
import { DeleteRounded } from "@mui/icons-material";
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import MonitorHeartIcon from "@mui/icons-material/MonitorHeart";
import { DELETE_FEED_POST } from "../../service/graphql/mutations/feed";
import { GET_FEED_BY_CATEGORY, GET_FEEDS } from "../../service/graphql/queries";

function WorkoutCard({ workout }) {
  const { user, time, stats, description } = workout;
  const [deleteWorkout] = useMutation(DELETE_FEED_POST, {
    variables: { id: workout.id },
    refetchQueries: [
      {
        query: GET_FEEDS,
      },
      {
        query: GET_FEED_BY_CATEGORY,
      },
    ],
    update(cache, { data: { deletedFeed } }) {
      try {
        const existingFeed = cache.readQuery({ query: GET_FEEDS });
        if (existingFeed) {
          cache.writeQuery({
            query: GET_FEEDS,
            data: {
              allFeeds: existingFeed.allFeeds.filter(
                (feed) => feed.id !== deletedFeed.id,
              ),
            },
          });
        }
      } catch (error) {
        console.warn("Erro ao deletar feed no cache:", error);
      }

      try {
        const existingCategoryFeed = cache.readQuery({
          query: GET_FEED_BY_CATEGORY,
          variables: { category: deletedFeed.category },
        });
        if (existingCategoryFeed) {
          cache.writeQuery({
            query: GET_FEED_BY_CATEGORY,
            variables: { category: deletedFeed.category },
            data: {
              feedByCategory: existingCategoryFeed.feedByCategory.filter(
                (feed) => feed.id !== deletedFeed.id,
              ),
            },
          });
        }
      } catch (error) {
        console.warn("Erro ao deletar feed por categoria no cache:", error);
      }
    },
  });

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleDelete = () => {
    deleteWorkout({
      variables: { id: workout.id },
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-5 flex flex-col h-full">
        <div className="flex-grow">
          {/* Time */}
          <div className="mb-4">
            <span className="text-sm text-gray-600">Tempo:</span>
            <div className="text-xl font-bold text-gray-900">
              {formatTime(time)}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-1 mb-4">
            <div className="bg-brand-green-lime rounded-lg px-3 py-2.5 text-center flex flex-col items-center justify-center min-h-[75px]">
              <DirectionsRunIcon className="w-4 h-4 text-black mb-1" />
              <div className="text-[10px] font-bold text-black mb-0.5 leading-tight">
                Distância
              </div>
              <div className="text-xs font-bold text-black leading-tight">
                {stats.distance}
              </div>
            </div>
            <div className="bg-brand-green-lime rounded-lg px-3 py-2.5 text-center flex flex-col items-center justify-center min-h-[75px]">
              <LocalFireDepartmentIcon className="w-4 h-4 text-black mb-1" />
              <div className="text-[10px] font-bold text-black mb-0.5 leading-tight">
                Calorias
              </div>
              <div className="text-xs font-bold text-black leading-tight">
                {stats.calories}
              </div>
            </div>
            <div className="bg-brand-green-lime rounded-lg px-3 py-2.5 text-center flex flex-col items-center justify-center min-h-[75px]">
              <MonitorHeartIcon className="w-4 h-4 text-black mb-1" />
              <div className="text-[10px] font-bold text-black mb-0.5 leading-tight">
                Batimentos
              </div>
              <div className="text-xs font-bold text-black leading-tight">
                {stats.heartRate}
              </div>
            </div>
          </div>

          {/* User info */}
          <div className="flex items-center mb-3">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
              {user.name.charAt(0)}
            </div>
            <span className="ml-2 text-sm font-medium text-gray-900">
              {user.name}
            </span>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
          {/* seu conteúdo aqui */}
        </div>
        {/* Button delete */}
        <div className="py-3 flex justify-end">
          <button
            type="button"
            className="bg-red-500 p-1 shadow-md text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
            onClick={handleDelete}
          >
            <DeleteRounded className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default WorkoutCard;
