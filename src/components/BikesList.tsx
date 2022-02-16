import { Badge, Box, Button, Card, Group, SimpleGrid, Text, useMantineTheme } from '@mantine/core';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import Star from '../../public/star.svg';

type Props = {
  bikes: any;
};
function BikesList({ bikes }: Props) {
  const theme = useMantineTheme();
  const secondaryColor = theme.colorScheme === 'dark' ? theme.colors.dark[1] : theme.colors.gray[7];

  return (
    <SimpleGrid
      mt={50}
      cols={3}
      spacing="lg"
      breakpoints={[
        { maxWidth: 768, cols: 2, spacing: 'md' },
        { maxWidth: 600, cols: 1, spacing: 'sm' },
      ]}
    >
      {bikes.map((bike: any) => (
        <Card shadow="sm" padding="lg">
          <Card.Section sx={{ cursor: 'pointer' }}>
            <Link href="/bike">
              <Box component="a">
                <Image
                  alt="Mountains"
                  src={bike.img}
                  layout="responsive"
                  width={700}
                  height={475}
                />
                {!bike.available && (
                  <Badge
                    color={bike.available ? 'cyan' : 'pink'}
                    variant="light"
                    sx={{ position: 'absolute', top: 20, right: 10, padding: 10 }}
                  >
                    Unavailable
                  </Badge>
                )}
              </Box>
            </Link>
          </Card.Section>
          <Group position="apart" style={{ marginBottom: 5, marginTop: theme.spacing.sm }}>
            <Text weight={600}>{bike.title}</Text>
          </Group>

          <Group direction="row" position="apart" align="center" mt={10} mb={20}>
            <Group direction="row" position="left" spacing={5}>
              <Text size="sm" style={{ color: secondaryColor, lineHeight: 1.5 }} weight="bold">
                {bike.rating}
              </Text>
              <Star style={{ height: 20, width: 20 }} />
              <Text size="sm" style={{ color: secondaryColor, lineHeight: 1.5 }}>
                ({bike.ratingCount} reviews)
              </Text>
            </Group>
            <Group align="center">
              <Text size="md" weight={600} style={{ color: secondaryColor }}>
                120$
                <Text component="span" size="sm" weight={400} style={{ color: secondaryColor }}>
                  {' '}
                  / day
                </Text>
              </Text>
            </Group>
          </Group>
          <Button
            variant="light"
            color="blue"
            fullWidth
            style={{ marginTop: 14, flexGrow: 1 }}
            disabled={!bike.available}
          >
            Book now
          </Button>
        </Card>
      ))}
    </SimpleGrid>
  );
}

export default BikesList;
