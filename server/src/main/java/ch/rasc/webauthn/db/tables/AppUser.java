/*
 * This file is generated by jOOQ.
 */
package ch.rasc.webauthn.db.tables;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import org.jooq.Field;
import org.jooq.ForeignKey;
import org.jooq.Identity;
import org.jooq.Name;
import org.jooq.Record;
import org.jooq.Row6;
import org.jooq.Schema;
import org.jooq.Table;
import org.jooq.TableField;
import org.jooq.TableOptions;
import org.jooq.UniqueKey;
import org.jooq.impl.DSL;
import org.jooq.impl.SQLDataType;
import org.jooq.impl.TableImpl;

import ch.rasc.webauthn.db.Keys;
import ch.rasc.webauthn.db.Webauthn;
import ch.rasc.webauthn.db.tables.records.AppUserRecord;

/**
 * This class is generated by jOOQ.
 */
@SuppressWarnings({ "all", "unchecked", "rawtypes" })
public class AppUser extends TableImpl<AppUserRecord> {

  private static final long serialVersionUID = 1L;

  /**
   * The reference instance of <code>webauthn.app_user</code>
   */
  public static final AppUser APP_USER = new AppUser();

  /**
   * The class holding records for this type
   */
  @Override
  public Class<AppUserRecord> getRecordType() {
    return AppUserRecord.class;
  }

  /**
   * The column <code>webauthn.app_user.id</code>.
   */
  public final TableField<AppUserRecord, Long> ID = createField(DSL.name("id"),
      SQLDataType.BIGINT.nullable(false).identity(true), this, "");

  /**
   * The column <code>webauthn.app_user.username</code>.
   */
  public final TableField<AppUserRecord, String> USERNAME = createField(
      DSL.name("username"), SQLDataType.VARCHAR(255).nullable(false), this, "");

  /**
   * The column <code>webauthn.app_user.recovery_token</code>.
   */
  public final TableField<AppUserRecord, byte[]> RECOVERY_TOKEN = createField(
      DSL.name("recovery_token"),
      SQLDataType.BINARY(16).defaultValue(DSL.field("NULL", SQLDataType.BINARY)), this,
      "");

  /**
   * The column <code>webauthn.app_user.registration_start</code>.
   */
  public final TableField<AppUserRecord, LocalDateTime> REGISTRATION_START = createField(
      DSL.name("registration_start"), SQLDataType.LOCALDATETIME(0)
          .defaultValue(DSL.field("NULL", SQLDataType.LOCALDATETIME)),
      this, "");

  /**
   * The column <code>webauthn.app_user.registration_add_start</code>.
   */
  public final TableField<AppUserRecord, LocalDateTime> REGISTRATION_ADD_START = createField(
      DSL.name("registration_add_start"), SQLDataType.LOCALDATETIME(0)
          .defaultValue(DSL.field("NULL", SQLDataType.LOCALDATETIME)),
      this, "");

  /**
   * The column <code>webauthn.app_user.registration_add_token</code>.
   */
  public final TableField<AppUserRecord, byte[]> REGISTRATION_ADD_TOKEN = createField(
      DSL.name("registration_add_token"),
      SQLDataType.BINARY(16).defaultValue(DSL.field("NULL", SQLDataType.BINARY)), this,
      "");

  private AppUser(Name alias, Table<AppUserRecord> aliased) {
    this(alias, aliased, null);
  }

  private AppUser(Name alias, Table<AppUserRecord> aliased, Field<?>[] parameters) {
    super(alias, null, aliased, parameters, DSL.comment(""), TableOptions.table());
  }

  /**
   * Create an aliased <code>webauthn.app_user</code> table reference
   */
  public AppUser(String alias) {
    this(DSL.name(alias), APP_USER);
  }

  /**
   * Create an aliased <code>webauthn.app_user</code> table reference
   */
  public AppUser(Name alias) {
    this(alias, APP_USER);
  }

  /**
   * Create a <code>webauthn.app_user</code> table reference
   */
  public AppUser() {
    this(DSL.name("app_user"), null);
  }

  public <O extends Record> AppUser(Table<O> child, ForeignKey<O, AppUserRecord> key) {
    super(child, key, APP_USER);
  }

  @Override
  public Schema getSchema() {
    return Webauthn.WEBAUTHN;
  }

  @Override
  public Identity<AppUserRecord, Long> getIdentity() {
    return (Identity<AppUserRecord, Long>) super.getIdentity();
  }

  @Override
  public UniqueKey<AppUserRecord> getPrimaryKey() {
    return Keys.KEY_APP_USER_PRIMARY;
  }

  @Override
  public List<UniqueKey<AppUserRecord>> getKeys() {
    return Arrays.<UniqueKey<AppUserRecord>>asList(Keys.KEY_APP_USER_PRIMARY,
        Keys.KEY_APP_USER_USERNAME);
  }

  @Override
  public AppUser as(String alias) {
    return new AppUser(DSL.name(alias), this);
  }

  @Override
  public AppUser as(Name alias) {
    return new AppUser(alias, this);
  }

  /**
   * Rename this table
   */
  @Override
  public AppUser rename(String name) {
    return new AppUser(DSL.name(name), null);
  }

  /**
   * Rename this table
   */
  @Override
  public AppUser rename(Name name) {
    return new AppUser(name, null);
  }

  // -------------------------------------------------------------------------
  // Row6 type methods
  // -------------------------------------------------------------------------

  @Override
  public Row6<Long, String, byte[], LocalDateTime, LocalDateTime, byte[]> fieldsRow() {
    return (Row6) super.fieldsRow();
  }
}
