using System;
using System.Collections.Generic;

namespace MTGCommander.Core.Entities;

public class GameCard
{
    public string Id { get; }
    public string Name { get; }
    public IReadOnlyCollection<string> Types { get; }
    public string OwnerId { get; }
    public bool IsTapped { get; private set; }
    public IDictionary<string, int> Counters { get; }
    public ICollection<string> Attachments { get; }
    public string CurrentZoneId { get; private set; }

    public GameCard(string id, string name, IEnumerable<string> types, string ownerId, string? initialZoneId = null)
    {
        Id = id;
        Name = name;
        Types = new List<string>(types);
        OwnerId = ownerId;
        IsTapped = false;
        Counters = new Dictionary<string, int>();
        Attachments = new List<string>();
        CurrentZoneId = initialZoneId ?? string.Empty;
    }

    public void Tap()
    {
        IsTapped = true;
    }

    public void Untap()
    {
        IsTapped = false;
    }

    public void AddCounter(string counterType, int amount)
    {
        if (!Counters.ContainsKey(counterType))
        {
            Counters[counterType] = 0;
        }
        Counters[counterType] += amount;
    }

    public void RemoveCounter(string counterType, int amount)
    {
        if (Counters.ContainsKey(counterType))
        {
            Counters[counterType] = Math.Max(0, Counters[counterType] - amount);
            if (Counters[counterType] == 0)
            {
                Counters.Remove(counterType);
            }
        }
    }

    public void AttachCard(string cardId)
    {
        if (!Attachments.Contains(cardId))
        {
            Attachments.Add(cardId);
        }
    }

    public void DetachCard(string cardId)
    {
        Attachments.Remove(cardId);
    }

    public void MoveToZone(string zoneId)
    {
        CurrentZoneId = zoneId;
    }
} 