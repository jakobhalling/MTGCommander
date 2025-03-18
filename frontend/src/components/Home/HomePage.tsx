import React from 'react';
import {
  Grid,
  Column,
  Tile,
  Tag,
  ClickableTile,
  Button,
  DataTable,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from '@carbon/react';
import { Add } from '@carbon/icons-react';
import { useNavigate } from 'react-router-dom';

// Mock data for ongoing matches
const ongoingMatches = [
  {
    id: '1',
    name: 'Commander Showdown',
    players: ['Player1', 'Player2', 'Player3', 'Player4'],
    status: 'In Progress',
    turn: 'Player2',
    started: '10 minutes ago',
  },
  {
    id: '2',
    name: 'Casual EDH',
    players: ['CommanderFan', 'MTGLover', 'SpellSlinger'],
    status: 'In Progress',
    turn: 'MTGLover',
    started: '25 minutes ago',
  },
];

// Mock data for open lobbies
const openLobbies = [
  {
    id: '101',
    name: 'Join Our Commander Battle!',
    host: 'DragonMaster',
    players: ['DragonMaster', 'TokenGenerator'],
    maxPlayers: 4,
    format: 'Commander',
    status: 'Waiting for players',
  },
  {
    id: '102',
    name: 'Competitive EDH',
    host: 'cEDHPlayer',
    players: ['cEDHPlayer', 'ComboKing', 'ControlMage'],
    maxPlayers: 4,
    format: 'Commander',
    status: 'Waiting for players',
  },
  {
    id: '103',
    name: 'Casual Fun Only',
    host: 'FunCommander',
    players: ['FunCommander'],
    maxPlayers: 4,
    format: 'Commander',
    status: 'Waiting for players',
  },
];

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const ongoingMatchesHeaders = [
    { key: 'name', header: 'Game Name' },
    { key: 'players', header: 'Players' },
    { key: 'turn', header: 'Current Turn' },
    { key: 'started', header: 'Started' },
    { key: 'actions', header: 'Actions' },
  ];

  const openLobbiesHeaders = [
    { key: 'name', header: 'Lobby Name' },
    { key: 'host', header: 'Host' },
    { key: 'players', header: 'Players' },
    { key: 'status', header: 'Status' },
    { key: 'actions', header: 'Actions' },
  ];

  return (
    <div className="home-page">
      <Grid fullWidth>
        <Column lg={16} md={8} sm={4}>
          <h1 className="page-title">MTG Commander</h1>
          <p className="page-description">
            Welcome to the MTG Commander online experience. Play the popular Commander format
            with friends or challenge yourself in singleplayer mode.
          </p>
        </Column>
      </Grid>

      <Grid fullWidth className="game-actions">
        <Column lg={8} md={4} sm={4}>
          <Button
            renderIcon={Add}
            onClick={() => navigate('/multiplayer/create')}
            kind="primary"
          >
            Create New Game
          </Button>
        </Column>
        <Column lg={8} md={4} sm={4} className="text-right">
          <Button onClick={() => navigate('/decks')} kind="tertiary">
            Manage Decks
          </Button>
        </Column>
      </Grid>

      <Grid fullWidth className="game-overview">
        <Column lg={16} md={8} sm={4}>
          <Tabs>
            <TabList aria-label="Game tabs">
              <Tab>Your Games</Tab>
              <Tab>Open Lobbies</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                {ongoingMatches.length > 0 ? (
                  <DataTable rows={ongoingMatches} headers={ongoingMatchesHeaders}>
                    {({ rows, headers, getHeaderProps, getTableProps }) => (
                      <Table {...getTableProps()}>
                        <TableHead>
                          <TableRow>
                            {headers.map((header) => (
                              <TableHeader {...getHeaderProps({ header })}>
                                {header.header}
                              </TableHeader>
                            ))}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {rows.map((row) => (
                            <TableRow key={row.id}>
                              <TableCell>{row.cells[0].value}</TableCell>
                              <TableCell>
                                {ongoingMatches.find(match => match.id === row.id)?.players.join(', ')}
                              </TableCell>
                              <TableCell>{row.cells[2].value}</TableCell>
                              <TableCell>{row.cells[3].value}</TableCell>
                              <TableCell>
                                <Button kind="ghost" onClick={() => navigate(`/multiplayer/game/${row.id}`)}>
                                  Resume
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </DataTable>
                ) : (
                  <Tile className="empty-state">
                    <h4>No active games</h4>
                    <p>You don't have any active games. Create a new game or join an open lobby.</p>
                  </Tile>
                )}
              </TabPanel>
              <TabPanel>
                {openLobbies.length > 0 ? (
                  <DataTable rows={openLobbies} headers={openLobbiesHeaders}>
                    {({ rows, headers, getHeaderProps, getTableProps }) => (
                      <Table {...getTableProps()}>
                        <TableHead>
                          <TableRow>
                            {headers.map((header) => (
                              <TableHeader {...getHeaderProps({ header })}>
                                {header.header}
                              </TableHeader>
                            ))}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {rows.map((row) => (
                            <TableRow key={row.id}>
                              <TableCell>{row.cells[0].value}</TableCell>
                              <TableCell>{row.cells[1].value}</TableCell>
                              <TableCell>
                                {openLobbies.find(lobby => lobby.id === row.id)?.players.length}/
                                {openLobbies.find(lobby => lobby.id === row.id)?.maxPlayers}
                              </TableCell>
                              <TableCell>
                                <Tag type="green">{row.cells[3].value}</Tag>
                              </TableCell>
                              <TableCell>
                                <Button kind="primary" onClick={() => navigate(`/multiplayer/lobby/${row.id}`)}>
                                  Join
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </DataTable>
                ) : (
                  <Tile className="empty-state">
                    <h4>No open lobbies</h4>
                    <p>There are no open lobbies at the moment. Create a new game to start playing.</p>
                  </Tile>
                )}
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Column>
      </Grid>

      <Grid fullWidth className="quick-actions">
        <Column lg={8} md={4} sm={4}>
          <ClickableTile
            className="action-tile"
            onClick={() => navigate('/multiplayer')}
          >
            <h3>Multiplayer</h3>
            <p>Play Commander with friends or join public games</p>
          </ClickableTile>
        </Column>
        <Column lg={8} md={4} sm={4}>
          <ClickableTile
            className="action-tile"
            onClick={() => navigate('/singleplayer')}
          >
            <h3>Singleplayer</h3>
            <p>Practice your skills against AI opponents</p>
          </ClickableTile>
        </Column>
      </Grid>
    </div>
  );
};

export default HomePage;
