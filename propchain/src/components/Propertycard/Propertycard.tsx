import { Card, CardContent, CardOverflow, Divider, Typography } from "@mui/joy";
import { PropertycardProps } from "./Propertycard.types";
import { useRouter } from "next/navigation";

const Propertycard: React.FC<PropertycardProps> = ({ id, name, location, price, zoning }) => {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/property/${id}`);
  };

  return (
    <Card variant="outlined" sx={{ width: 1 / 2 }} onClick={handleCardClick}>
      <CardContent>
        <Typography level="title-lg" fontWeight="xl">
          {name}
        </Typography>
        <Typography level="title-md">{zoning}</Typography>
        <Typography level="body-md">{location}</Typography>
      </CardContent>
      <CardOverflow variant="soft">
        <Divider inset="context" />
        <Typography level="body-md" py={1}>
          {price} ETH
        </Typography>
      </CardOverflow>
    </Card>
  );
};

export default Propertycard;
