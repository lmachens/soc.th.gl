import { createStyles } from "@mantine/core";

export default createStyles((theme) => ({
    footer: {
        marginTop: 120,
        paddingTop: theme.spacing.xl * 2,
        paddingBottom: theme.spacing.xl * 2,
        backgroundColor: theme.colors.dark[6],
        borderTop: `1px solid ${
          theme.colors.dark[5]
        }`,
      },
    
      logo: {
        maxWidth: 200,
    
        [theme.fn.smallerThan('sm')]: {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        },
      },
    
      description: {
        marginTop: 5,
    
        [theme.fn.smallerThan('sm')]: {
          marginTop: theme.spacing.xs,
          textAlign: 'center',
        },
      },
    
      inner: {
        display: 'flex',
        justifyContent: 'space-between',
    
        [theme.fn.smallerThan('sm')]: {
          flexDirection: 'column',
          alignItems: 'center',
        },
      },
    
      groups: {
        display: 'flex',
        flexWrap: 'wrap',
      },
    
      wrapper: {
        width: 160,
      },
    
      link: {
        display: 'block',
        color: theme.colors.gray[6],
        fontSize: theme.fontSizes.sm,
        paddingTop: 3,
        paddingBottom: 3,
    
        '&:hover': {
          textDecoration: 'underline',
        },
      },
    
      title: {
        fontSize: theme.fontSizes.lg,
        fontWeight: 700,
        fontFamily: `Greycliff CF, ${theme.fontFamily}`,
        marginBottom: theme.spacing.xs / 2,
        color: theme.white
      },
    
      afterFooter: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: theme.spacing.xl,
        paddingTop: theme.spacing.xl,
        paddingBottom: theme.spacing.xl,
        borderTop: `1px solid ${
          theme.colors.dark[4]
        }`,
    
        [theme.fn.smallerThan('sm')]: {
          flexDirection: 'column',
        },
      },
    
      social: {
        [theme.fn.smallerThan('sm')]: {
          marginTop: theme.spacing.xs,
        },
      },
  }));