/**
 * Supabase Service
 * 
 * This module provides a client for interacting with Supabase,
 * including database operations and authentication.
 */

const { createClient } = require('@supabase/supabase-js');
const { SUPABASE_CONFIG } = require('../config');

// Initialize Supabase client
const supabase = createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.key);

/**
 * Generic database query function
 * @param {String} table - The table to query
 * @param {Object} options - Query options
 * @returns {Promise} - Query result
 */
const query = async (table, options = {}) => {
  const {
    select = '*',
    filters = [],
    order = null,
    limit = null,
    offset = null,
    single = false
  } = options;

  let query = supabase
    .from(table)
    .select(select);

  // Apply filters
  filters.forEach(filter => {
    const { column, operator, value } = filter;
    query = query.filter(column, operator, value);
  });

  // Apply ordering
  if (order) {
    const { column, ascending = true } = order;
    query = query.order(column, { ascending });
  }

  // Apply pagination
  if (limit) {
    query = query.limit(limit);
  }

  if (offset) {
    query = query.offset(offset);
  }

  // Execute query
  const { data, error } = single
    ? await query.single()
    : await query;

  if (error) {
    console.error(`Supabase query error (${table}):`, error);
    throw new Error(`Database query failed: ${error.message}`);
  }

  return data;
};

/**
 * Insert a record into a table
 * @param {String} table - The table to insert into
 * @param {Object|Array} records - The record(s) to insert
 * @returns {Promise} - Insert result
 */
const insert = async (table, records) => {
  const { data, error } = await supabase
    .from(table)
    .insert(records)
    .select();

  if (error) {
    console.error(`Supabase insert error (${table}):`, error);
    throw new Error(`Database insert failed: ${error.message}`);
  }

  return data;
};

/**
 * Update records in a table
 * @param {String} table - The table to update
 * @param {Object} updates - The fields to update
 * @param {Object} match - The conditions to match
 * @returns {Promise} - Update result
 */
const update = async (table, updates, match) => {
  let query = supabase
    .from(table)
    .update(updates)
    .select();

  // Apply match conditions
  Object.entries(match).forEach(([column, value]) => {
    query = query.eq(column, value);
  });

  const { data, error } = await query;

  if (error) {
    console.error(`Supabase update error (${table}):`, error);
    throw new Error(`Database update failed: ${error.message}`);
  }

  return data;
};

/**
 * Delete records from a table
 * @param {String} table - The table to delete from
 * @param {Object} match - The conditions to match
 * @returns {Promise} - Delete result
 */
const remove = async (table, match) => {
  let query = supabase
    .from(table)
    .delete()
    .select();

  // Apply match conditions
  Object.entries(match).forEach(([column, value]) => {
    query = query.eq(column, value);
  });

  const { data, error } = await query;

  if (error) {
    console.error(`Supabase delete error (${table}):`, error);
    throw new Error(`Database delete failed: ${error.message}`);
  }

  return data;
};

/**
 * Get a record by ID
 * @param {String} table - The table to query
 * @param {String|Number} id - The record ID
 * @param {String} select - Fields to select
 * @returns {Promise} - The record
 */
const getById = async (table, id, select = '*') => {
  return query(table, {
    select,
    filters: [{ column: 'id', operator: 'eq', value: id }],
    single: true
  });
};

/**
 * Get all records from a table
 * @param {String} table - The table to query
 * @param {Object} options - Query options
 * @returns {Promise} - The records
 */
const getAll = async (table, options = {}) => {
  return query(table, options);
};

module.exports = {
  supabase,
  query,
  insert,
  update,
  remove,
  getById,
  getAll
};
