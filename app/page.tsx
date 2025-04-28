import Card from "./components/Card";
import { dummyCards } from "./data/dummyCard";


export default function Home() {
  return (
    <main className="flex flex-wrap gap-4 justify-center  pt-16">
      {dummyCards.map((card) => (
        <Card
        key={card.id}
        id={card.id}
        imageUrl={card.imageUrl}
        title={card.title}
        description={card.description}
        avatarUrl={card.avatarUrl}
        username={card.username}
        views={card.views}
        fullImage={card.fullImage}
      />
      ))}
    </main>
  );
}
